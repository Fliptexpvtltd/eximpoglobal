import { useState, useEffect } from 'react';
import { ArrowLeft, Package, MapPin, Calendar, FileText, Download, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { PO, Shipment } from '../App';

interface ShipmentTrackingProps {
  po: PO;
  user?: any;
  activeMode?: 'buyer' | 'seller';
  onBack: () => void;
}

export function ShipmentTracking({ po, user, activeMode = 'buyer', onBack }: ShipmentTrackingProps) {
  const effectiveRole = user?.role === 'both' ? activeMode : (user?.role || 'buyer');
  const isSeller = effectiveRole === 'seller';
  const themeColor = isSeller ? '#059669' : '#2563eb';
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipment();
  }, [po.id]);

  const fetchShipment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shipments?order_id=${po.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setShipment(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching shipment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shipment details...</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl mb-2">No Shipment Created Yet</h3>
          <p className="text-gray-600">The seller hasn't created a shipment for this order yet.</p>
        </div>
      </div>
    );
  }

  const trackingEvents = shipment.tracking_updates || [];
  const completedMilestones = trackingEvents.length;
  const totalMilestones = 7;
  const progress = (completedMilestones / totalMilestones) * 100;

  // Legacy mock for structure reference - removing
  const mockShipment: Shipment = {
  id: 'ship-001',
  poId: 'po-1',
  mode: 'sea',
  originPort: 'Shanghai Port',
  destinationPort: 'Los Angeles Port',
  forwarder: 'Maersk Shipping',
  containerType: '40ft HC',
  trackingNumber: 'MAEU123456789',
  status: 'in_transit',
  milestones: [
    {
      name: 'Production Started',
      date: '2025-10-15',
      location: 'Shanghai Factory',
      completed: true,
    },
    {
      name: 'Pre-shipment Inspection',
      date: '2025-11-01',
      location: 'Shanghai Factory',
      completed: true,
    },
    {
      name: 'Departed Origin Port',
      date: '2025-11-05',
      location: 'Shanghai Port',
      completed: true,
    },
    {
      name: 'In Transit',
      date: '2025-11-08',
      location: 'Pacific Ocean',
      completed: true,
    },
    {
      name: 'Arrive Destination Port',
      date: '2025-11-22',
      location: 'Los Angeles Port',
      completed: false,
    },
    {
      name: 'Customs Clearance',
      date: '2025-11-24',
      location: 'Los Angeles',
      completed: false,
    },
    {
      name: 'Delivered',
      date: '2025-11-26',
      location: 'Your Warehouse',
      completed: false,
    },
  ],
  eta: '2025-11-22',
  documents: [
    { name: 'Commercial Invoice', type: 'invoice', url: '#' },
    { name: 'Packing List', type: 'packing', url: '#' },
    { name: 'Bill of Lading', type: 'bl', url: '#' },
    { name: 'Certificate of Origin', type: 'coo', url: '#' },
    { name: 'Inspection Report', type: 'inspection', url: '#' },
  ],
};

const containerDetails = {
  containerNumber: shipment.tracking_number || 'N/A',
  sealNumber: 'N/A',
  grossWeight: 'N/A',
  volume: 'N/A',
  packageCount: 'N/A',
};

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>
      
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl mb-2">Shipment Tracking</h1>
            <p className="text-base md:text-xl text-gray-600">PO #{po.id}</p>
          </div>
          
          <div className={`px-4 py-2 rounded-lg ${
            shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
            shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
            shipment.status === 'customs' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {shipment.status === 'delivered' && 'Delivered'}
            {shipment.status === 'in_transit' && 'In Transit'}
            {shipment.status === 'customs' && 'Customs Clearance'}
            {shipment.status === 'pending' && 'Pending'}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs md:text-sm text-blue-600 mb-1">Tracking Number</div>
            <div className="text-sm md:text-lg text-blue-900 truncate">{shipment.tracking_number || 'N/A'}</div>
          </div>
          
          <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs md:text-sm text-blue-600 mb-1">Carrier</div>
            <div className="text-sm md:text-lg text-blue-900">{shipment.carrier || 'N/A'}</div>
          </div>
          
          <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs md:text-sm text-blue-600 mb-1">Est. Delivery</div>
            <div className="text-sm md:text-lg text-blue-900">{shipment.estimated_delivery ? new Date(shipment.estimated_delivery).toLocaleDateString() : 'N/A'}</div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Actual Delivery</div>
            <div className="text-lg text-blue-900">{shipment.actual_delivery ? new Date(shipment.actual_delivery).toLocaleDateString() : 'Pending'}</div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700">Shipment Progress</span>
            <span className="text-gray-900">{completedMilestones} of {totalMilestones} milestones completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <div>
              <div className="text-sm text-gray-600">From</div>
              <div className="text-gray-900">{shipment.origin || 'N/A'}</div>
            </div>
          </div>
          
          <div className="flex-1 mx-6">
            <div className="border-t-2 border-dashed border-gray-300"></div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-600">To</div>
              <div className="text-gray-900">{shipment.destination || 'N/A'}</div>
            </div>
            <MapPin className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl mb-6">Shipment Timeline</h2>
            
            {trackingEvents.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>No tracking updates yet</p>
              </div>
            )}
            
            <div className="space-y-6">
              {trackingEvents.map((event: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-green-100 border-green-500">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    {index < trackingEvents.length - 1 && (
                      <div className="w-0.5 h-16 bg-green-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-lg text-gray-900">
                        {event.status?.replace('_', ' ').toUpperCase() || 'Update'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <div className="mt-2 text-sm text-gray-700">
                        {event.description}
                      </div>
                    )}
                    <div className="mt-2 text-sm text-green-700">
                      ✓ Completed
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl">Shipping Documents</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Download All
              </button>
            </div>
            
            <div className="space-y-3">
              {(!shipment.documents || shipment.documents.length === 0) && (
                <div className="text-center py-8 text-gray-600">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p>No documents uploaded yet</p>
                </div>
              )}
              {(shipment.documents || []).map((doc: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-gray-900">{doc.name || `Document ${index + 1}`}</div>
                      <div className="text-sm text-gray-600">{doc.type || 'Document'}</div>
                    </div>
                  </div>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600">
              <Upload className="w-5 h-5" />
              Upload Additional Documents
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="mb-4">Container Details</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Container Number</div>
                <div className="text-gray-900">{containerDetails.containerNumber}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Container Type</div>
                <div className="text-gray-900">{mockShipment.containerType}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Seal Number</div>
                <div className="text-gray-900">{containerDetails.sealNumber}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Gross Weight</div>
                <div className="text-gray-900">{containerDetails.grossWeight}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Volume</div>
                <div className="text-gray-900">{containerDetails.volume}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Package Count</div>
                <div className="text-gray-900">{containerDetails.packageCount}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Track on Forwarder Site
              </button>
              
              <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Contact Forwarder
              </button>
              
              <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Request Customs Broker
              </button>
              
              <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Report Issue
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-1" />
              <div>
                <h3 className="text-yellow-900 mb-2">Customs Preparation</h3>
                <p className="text-sm text-yellow-800 mb-3">
                  Your shipment will arrive at destination port in 14 days. Prepare these documents for customs clearance:
                </p>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Import license (if required)</li>
                  <li>• HS code confirmation</li>
                  <li>• Payment proof for duties</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
