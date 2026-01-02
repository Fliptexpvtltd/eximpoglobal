import { useState, useEffect } from 'react';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, Package, Eye } from 'lucide-react';
import type { RFQ } from '../App';

interface MyRFQsProps {
  onBack: () => void;
  onViewQuotes: (rfq: RFQ) => void;
}

export function MyRFQs({ onBack, onViewQuotes }: MyRFQsProps) {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed' | 'draft'>('all');

  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/rfqs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success && data.data) {
        const mappedRfqs: RFQ[] = data.data.map((r: any) => ({
          id: r.id,
          buyerId: r.buyer_id,
          products: r.line_items?.map((item: any) => ({
            productId: item.productId || '',
            quantity: item.quantity || 0,
            specifications: item.specifications || '',
          })) || [],
          incoterm: r.incoterms || 'FOB',
          destinationPort: r.delivery_location || '',
          deadline: r.expires_at?.split('T')[0] || '',
          status: r.status || 'draft',
          createdAt: r.created_at?.split('T')[0] || '',
        }));
        setRfqs(mappedRfqs);
      }
    } catch (error) {
      console.error('Error fetching RFQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'gray', icon: FileText, label: 'Draft' },
      open: { color: 'blue', icon: Clock, label: 'Open' },
      sent: { color: 'blue', icon: Clock, label: 'Sent' },
      quoted: { color: 'green', icon: CheckCircle, label: 'Quoted' },
      accepted: { color: 'green', icon: CheckCircle, label: 'Accepted' },
      closed: { color: 'gray', icon: XCircle, label: 'Closed' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 bg-${config.color}-100 text-${config.color}-800 rounded-full text-sm`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const filteredRfqs = filter === 'all' 
    ? rfqs 
    : rfqs.filter(rfq => rfq.status === filter);

  const stats = [
    { label: 'Total RFQs', value: rfqs.length, color: 'blue' },
    { label: 'Open', value: rfqs.filter(r => r.status === 'open' || r.status === 'sent').length, color: 'blue' },
    { label: 'Quoted', value: rfqs.filter(r => r.status === 'quoted').length, color: 'green' },
    { label: 'Closed', value: rfqs.filter(r => r.status === 'closed' || r.status === 'accepted').length, color: 'gray' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading RFQs...</p>
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

      <div>
        <h1 className="text-3xl mb-2">My RFQs</h1>
        <p className="text-gray-600">Track and manage all your requests for quotation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({rfqs.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'open' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Open ({rfqs.filter(r => r.status === 'open' || r.status === 'sent').length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'draft' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Draft ({rfqs.filter(r => r.status === 'draft').length})
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'closed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Closed ({rfqs.filter(r => r.status === 'closed' || r.status === 'accepted').length})
          </button>
        </div>
      </div>

      {/* RFQ List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredRfqs.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl mb-2">No RFQs found</h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'Create your first RFQ to get started' : `No ${filter} RFQs`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRfqs.map((rfq) => (
              <div key={rfq.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">RFQ #{rfq.id.slice(0, 8)}</h3>
                      {getStatusBadge(rfq.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Products:</span>
                        <span className="ml-2 font-medium">{rfq.products.length} items</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Destination:</span>
                        <span className="ml-2 font-medium">{rfq.destinationPort || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Incoterm:</span>
                        <span className="ml-2 font-medium">{rfq.incoterm}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      <span>Created: {rfq.createdAt}</span>
                      {rfq.deadline && (
                        <span className="ml-4">Expires: {rfq.deadline}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {rfq.status === 'quoted' && (
                      <button
                        onClick={() => onViewQuotes(rfq)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Quotes
                      </button>
                    )}
                    {rfq.status === 'draft' && (
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Edit Draft
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


