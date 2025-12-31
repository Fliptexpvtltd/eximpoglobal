import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Package, Search, Filter, MapPin, Calendar, Truck, Ship, Plane, AlertCircle } from 'lucide-react';
import { User } from '../App';

interface ShipmentsProps {
  user: User | null;
  activeMode: 'buyer' | 'seller';
  onViewDetails: (shipmentId: string) => void;
}

export function Shipments({ user, activeMode, onViewDetails }: ShipmentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/shipments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        setShipments(data.data);
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'air': return <Plane className="w-5 h-5" />;
      case 'sea': return <Ship className="w-5 h-5" />;
      case 'rail': return <Truck className="w-5 h-5" />;
      case 'courier': return <Package className="w-5 h-5" />;
      default: return <Truck className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-blue-100 text-blue-700';
      case 'in_transit': return 'bg-yellow-100 text-yellow-700';
      case 'customs': return 'bg-orange-100 text-orange-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.tracking.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.poNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'In Transit', value: shipments.filter(s => s.status === 'in_transit').length, color: 'text-yellow-600' },
    { label: 'In Customs', value: shipments.filter(s => s.status === 'customs').length, color: 'text-orange-600' },
    { label: 'Delivered', value: shipments.filter(s => s.status === 'delivered').length, color: 'text-green-600' },
    { label: 'Booked', value: shipments.filter(s => s.status === 'booked').length, color: 'text-blue-600' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shipments...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shipments</h1>
        <p className="text-gray-600">Track and manage your shipments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by product, tracking number, or PO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="booked">Booked</option>
              <option value="in_transit">In Transit</option>
              <option value="customs">In Customs</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No shipments found</p>
          </div>
        ) : (
          filteredShipments.map((shipment) => (
            <div key={shipment.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getModeIcon(shipment.mode)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{shipment.product}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          {getStatusLabel(shipment.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">PO: {shipment.poNumber} • Tracking: {shipment.tracking}</p>
                      <p className="text-sm text-gray-500 mt-1">{shipment.supplier}</p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{shipment.origin}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-700">{shipment.destination}</span>
                  </div>

                  {/* Progress Bar */}
                  {shipment.status !== 'delivered' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{shipment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${shipment.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">ETA: {shipment.eta}</span>
                  </div>
                  {shipment.containerNo && (
                    <p className="text-xs text-gray-500">Container: {shipment.containerNo}</p>
                  )}
                  <button
                    onClick={() => onViewDetails(shipment.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Banner */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900 font-medium">Track Your Shipments in Real-Time</p>
          <p className="text-sm text-blue-700 mt-1">
            Click "View Details" on any shipment to see live tracking, milestone updates, and shipping documents.
          </p>
        </div>
      </div>
    </div>
  );
}
