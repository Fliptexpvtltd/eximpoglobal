import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Calendar, MapPin, Filter } from 'lucide-react';
import type { User } from '../App';

interface AllRFQsProps {
  user: User;
  onNavigate: (view: any) => void;
  onBack: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function AllRFQs({ user, onNavigate, onBack }: AllRFQsProps) {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'quoted' | 'closed'>('all');

  useEffect(() => {
    fetchAllRFQs();
  }, []);

  const fetchAllRFQs = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/rfqs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRfqs(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching RFQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRFQs = rfqs.filter(rfq => {
    if (filter === 'all') return true;
    return rfq.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      open: { bg: 'bg-blue-100', text: 'text-blue-800' },
      quoted: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-800' }
    };
    const style = statusMap[status] || statusMap.open;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {status || 'open'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading RFQs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All RFQs</h1>
              <p className="text-gray-600 mt-1">{filteredRFQs.length} request(s) for quotation</p>
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="quoted">Quoted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {filteredRFQs.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No RFQs found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredRFQs.map((rfq) => (
                <div
                  key={rfq.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {rfq.title || 'RFQ Request'}
                      </h3>
                      <p className="text-gray-600 mb-3">{rfq.buyer_company || 'Unknown Buyer'}</p>
                    </div>
                    {getStatusBadge(rfq.status)}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {rfq.line_items && rfq.line_items[0] && (
                      <div className="flex items-center text-sm text-gray-700">
                        <Package className="w-4 h-4 mr-2 text-gray-400" />
                        <span>
                          <span className="font-medium">Product:</span> {rfq.line_items[0].product_name}
                        </span>
                      </div>
                    )}
                    
                    {rfq.line_items && rfq.line_items[0] && (
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium mr-1">Qty:</span>
                        {rfq.line_items[0].quantity} units
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{rfq.delivery_location || 'Contact buyer'}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-700">
                      <span className="font-medium mr-1">Incoterms:</span>
                      {rfq.incoterms || 'FOB'}
                    </div>

                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {rfq.delivery_date
                          ? new Date(rfq.delivery_date).toLocaleDateString()
                          : 'Not specified'}
                      </span>
                    </div>
                  </div>

                  {rfq.notes && (
                    <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
                      {rfq.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      Posted {new Date(rfq.created_at).toLocaleDateString()}
                    </span>
                    {rfq.status === 'open' && (
                      <button
                        onClick={() => onNavigate({ view: 'submit-quote', rfqId: rfq.id })}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                      >
                        Submit Quote
                      </button>
                    )}
                    {rfq.status === 'quoted' && (
                      <span className="text-sm text-gray-600">Quote submitted</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
