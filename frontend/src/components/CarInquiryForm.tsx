import { useState } from 'react';
import { X, Send, Car } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface CarInquiryFormProps {
  product: {
    id: string;
    name: string;
    supplierId: string;
    price?: number;
    currency?: string;
  };
  user?: any;
  onClose: () => void;
  onLoginRequired: () => void;
}

export function CarInquiryForm({ product, user, onClose, onLoginRequired }: CarInquiryFormProps) {
  const [message, setMessage] = useState(
    `Hi, I am interested in the ${product.name}. Please share more details about availability, condition, and pricing.`
  );
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      onLoginRequired();
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: product.supplierId,
          message: `${message.trim()}${phone ? `\n\nContact: ${phone}` : ''}`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Inquiry sent! The seller will get back to you shortly.');
        onClose();
      } else {
        toast.error(data.message || 'Failed to send inquiry');
      }
    } catch {
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Request Information</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Vehicle summary */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900">{product.name}</p>
            {product.price ? (
              <p className="text-sm text-blue-700 mt-0.5">
                INR {product.price.toLocaleString()}
              </p>
            ) : (
              <p className="text-sm text-blue-600 mt-0.5">Price on request</p>
            )}
          </div>

          {/* Phone number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Mobile Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Sending...' : 'Send Inquiry'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            The seller will respond via your messages inbox.
          </p>
        </form>
      </div>
    </div>
  );
}
